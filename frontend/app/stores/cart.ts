import { defineStore } from 'pinia'
import { useRuntimeConfig, useFetch } from '#imports'

export interface CartItem {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        price: number
        imageUrl: string
        salePrice?: number
    }
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
        pending: false,
        error: null as any
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0)
        },
        cartTotal: (state) => {
            return state.items.reduce((total, item) => {
                const price = item.product.salePrice || item.product.price
                return total + (price * item.quantity)
            }, 0)
        }
    },

    actions: {
        async fetchCart() {
            this.pending = true
            this.error = null
            try {
                const config = useRuntimeConfig()
                const { data, error } = await useFetch<CartItem[]>(`${config.public.apiBase}/cart`, {
                    credentials: 'include'
                })

                if (error.value) {
                    if (error.value.statusCode === 401) {
                        this.items = [] // Not logged in, perfectly normal
                    } else {
                        this.error = error.value
                        this.items = []
                    }
                } else if (data.value) {
                    this.items = data.value
                }
            } catch (e) {
                this.error = e
            } finally {
                this.pending = false
            }
        },

        async addToCart(productId: string, quantity: number = 1) {
            try {
                const config = useRuntimeConfig()
                // Optimistic UI update could go here, but since the backend returns the
                // completely formed item (with product details), it's safer to wait or 
                // just re-fetch the entire cart, OR push the new returned item to state.

                // We do a direct $fetch because it's an action, not a reactive useFetch
                const newItem = await $fetch<CartItem>(`${config.public.apiBase}/cart`, {
                    method: 'POST',
                    body: { productId, quantity },
                    credentials: 'include'
                })

                // Check if item already exists in state
                const existingItem = this.items.find(i => i.id === newItem.id)
                if (existingItem) {
                    existingItem.quantity = newItem.quantity
                } else {
                    this.items.push(newItem)
                }

            } catch (err: any) {
                if (err.status === 401) {
                    // Handle unauthorized (maybe redirect to login)
                    useRouter().push('/auth/login')
                } else {
                    console.error('Failed to add to cart:', err)
                    throw err
                }
            }
        },

        async updateQuantity(cartItemId: string, newQuantity: number) {
            if (newQuantity < 1) {
                return this.removeItem(cartItemId)
            }

            // Optimistic update
            const item = this.items.find(i => i.id === cartItemId)
            let oldQuantity = 0
            if (item) {
                oldQuantity = item.quantity
                item.quantity = newQuantity
            }

            try {
                const config = useRuntimeConfig()
                await $fetch(`${config.public.apiBase}/cart/${cartItemId}`, {
                    method: 'PATCH',
                    body: { quantity: newQuantity },
                    credentials: 'include'
                })
            } catch (err) {
                // Revert optimistic update
                if (item) item.quantity = oldQuantity
                console.error('Failed to update quantity:', err)
                throw err
            }
        },

        async removeItem(cartItemId: string) {
            // Optimistic update
            const itemIndex = this.items.findIndex(i => i.id === cartItemId)
            let removedItem = null
            if (itemIndex > -1) {
                removedItem = this.items.splice(itemIndex, 1)[0]
            }

            try {
                const config = useRuntimeConfig()
                await $fetch(`${config.public.apiBase}/cart/${cartItemId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
            } catch (err) {
                // Revert optimistic update
                if (removedItem) {
                    this.items.splice(itemIndex, 0, removedItem)
                }
                console.error('Failed to remove item:', err)
                throw err
            }
        },

        // Call this on logout to clear local state
        clearCart() {
            this.items = []
            this.error = null
        }
    }
})
