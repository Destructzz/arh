<template>
  <!-- Toast message for unauthorized cart adds -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0"
  >
    <div v-if="authMessage" class="fixed top-24 right-4 bg-red-50 text-red-600 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 border border-red-100">
      <Icon name="lucide:alert-circle" size="20" />
      <span class="font-medium">{{ authMessage }}</span>
    </div>
  </transition>

  <div class="container mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Sidebar Filters -->
      <aside class="w-full md:w-64 space-y-8 flex-shrink-0 hidden md:block">
        <div>
          <h3 class="font-serif text-lg mb-4">Категории</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>
              <button
                class="hover:text-primary transition-colors"
                :class="!selectedCategoryId ? 'font-medium text-primary' : 'text-gray-700'"
                @click="selectedCategoryId = null"
              >
                Все растения ({{ totalProducts }})
              </button>
            </li>
            <template v-if="categoriesPending">
              <li class="text-xs text-gray-400">Загрузка категорий...</li>
            </template>
            <template v-else-if="flatCategories.length === 0">
              <li class="text-xs text-gray-400">Категорий пока нет</li>
            </template>
            <template v-else>
              <li
                v-for="category in flatCategories"
                :key="category.id"
                class="flex"
                :class="{ 'border-l border-gray-200': category.depth > 0 }"
                :style="{ marginLeft: `${category.depth * 8}px` }"
              >
                <button
                  class="hover:text-primary transition-colors text-left py-1 w-full"
                  :class="[
                    selectedCategoryId === category.id
                      ? 'font-medium text-primary'
                      : category.depth === 0
                        ? 'font-medium text-gray-700'
                        : 'text-gray-500'
                  ]"
                  :style="{ paddingLeft: `${category.depth > 0 ? 8 : 0}px` }"
                  @click="selectedCategoryId = category.id"
                >
                  <span v-if="category.depth > 0" class="text-gray-300 mr-1">|-</span>
                  <span>{{ category.name }}</span>
                  <span v-if="category.hasChildren" class="ml-1 text-[10px] uppercase tracking-widest text-gray-400">
                    Группа
                  </span>
                </button>
              </li>
            </template>
          </ul>
        </div>
        
        <div>
           <h3 class="font-serif text-lg mb-4">Цена</h3>
           <div class="space-y-4">
             <div class="flex items-center gap-3">
               <div class="relative w-full text-gray-500">
                 <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400">₽</span>
                 <input
                   v-model.number="selectedPriceRange[0]"
                   type="number"
                   :min="0"
                   :max="selectedPriceRange[1]"
                   class="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 transition-colors"
                   placeholder="От"
                 />
               </div>
               <span class="text-gray-400">—</span>
               <div class="relative w-full text-gray-500">
                 <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400">₽</span>
                 <input
                   v-model.number="selectedPriceRange[1]"
                   type="number"
                   :min="selectedPriceRange[0]"
                   class="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 transition-colors"
                   placeholder="До"
                 />
               </div>
             </div>
           </div>
        </div>

        <div>
           <h3 class="font-serif text-lg mb-4">Наличие</h3>
           <div class="space-y-2">
             <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
               <input
                 v-model="inStockEnabled"
                 type="checkbox"
                 class="rounded border-gray-300 text-primary focus:ring-primary"
               >
               В наличии
             </label>
             <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
               <input
                 v-model="outOfStockEnabled"
                 type="checkbox"
                 class="rounded border-gray-300 text-primary focus:ring-primary"
               >
               Нет в наличии
             </label>
           </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <div class="flex-grow">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-serif">{{ selectedCategoryName }}</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 hidden sm:block">Показано {{ delayedProducts.length }} товаров</span>
            <Listbox v-model="selectedSort" as="div" class="relative z-20">
              <ListboxButton class="relative w-full cursor-pointer rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-w-[180px]">
                <span class="block truncate">{{ sortOptions.find(o => o.value === selectedSort)?.label }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <Icon name="lucide:chevron-down" class="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute right-0 z-10 mt-1 max-h-60 w-full min-w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-primary/5 text-primary' : 'text-gray-900',
                        'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <Icon name="lucide:check" class="h-4 w-4" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-100 aspect-[3/4] mb-4"></div>
            <div class="h-4 bg-gray-100 w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-100 w-1/4"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 transition-all duration-300" :class="!isUpdating ? 'opacity-100 blur-0 scale-100' : 'opacity-30 blur-[2px] scale-[0.98]'">
          <div v-for="product in delayedProducts" :key="product.id" class="group cursor-pointer">
            <NuxtLink :to="`/shop/${product.id}`">
              <div class="relative overflow-hidden aspect-[3/4] bg-[#f4f7f6] mb-4 rounded-lg">
                <img 
                  :src="product.imageUrl ?? undefined" 
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <!-- Badges -->
                <div v-if="product.isNew" class="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] uppercase tracking-widest font-medium rounded-sm">
                  Новинка
                </div>
                <div v-if="product.isSale" class="absolute top-3 left-3 bg-accent text-white px-2 py-1 text-[10px] uppercase tracking-widest font-medium rounded-sm">
                  Sale
                </div>

                <!-- Quick Add Button -->
                <button 
                  @click.prevent="handleQuickAdd($event, product.id)" 
                  class="absolute bottom-4 right-4 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-300"
                  :class="{'opacity-100 translate-y-0': addingItems[product.id], 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0': !addingItems[product.id]}"
                  :disabled="addingItems[product.id]"
                >
                  <Icon v-if="addingItems[product.id]" name="lucide:loader-2" size="18" class="animate-spin" />
                  <Icon v-else name="lucide:shopping-bag" size="18" />
                </button>
              </div>
              
              <div class="space-y-1">
                <h3 class="font-serif text-lg leading-tight group-hover:text-primary transition-colors">{{ product.name }}</h3>
                <div class="flex items-center gap-2 text-sm">
                  <span :class="{'text-accent font-medium': product.salePrice, 'text-gray-500': !product.salePrice}">
                    {{ product.salePrice || product.price }} ₽
                  </span>
                  <span v-if="product.salePrice" class="text-gray-400 line-through text-xs">{{ product.price }} ₽</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

interface Product {
  id: string | number
  name: string
  price: number
  imageUrl?: string | null
  isActive?: boolean
  salePrice?: number
  isNew?: boolean
  isSale?: boolean
  category?: {
    id: string
  } | null
  inventoryItem?: {
    quantityOnHand: number
    reserved: number
  } | null
}

interface Category {
  id: string
  name: string
  parent?: {
    id: string
  } | null
}

interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
}

interface FlatCategoryNode {
  id: string
  name: string
  depth: number
  hasChildren: boolean
}

const config = useRuntimeConfig()
const cartStore = useCartStore()
const authStore = useAuthStore()

const authMessage = ref<string | null>(null)

const { data: realProducts, pending } = await useFetch<Product[]>(
  `${config.public.apiBase}/products`,
  {
    default: () => []
  }
)
const { data: categories, pending: categoriesPending } = await useFetch<Category[]>(
  `${config.public.apiBase}/categories`,
  {
    default: () => []
  }
)

const selectedCategoryId = ref<string | null>(null)
const inStockEnabled = ref(true)
const outOfStockEnabled = ref(true)
const priceRangeMin = 0
const priceRangeMax = 20000
const selectedPriceRange = ref([priceRangeMin, priceRangeMax])

const totalProducts = computed(() => realProducts.value.length)
const selectedCategoryName = computed(() => {
  if (!selectedCategoryId.value) {
    return 'Все растения'
  }
  const selected = categories.value.find((category) => category.id === selectedCategoryId.value)
  return selected?.name ?? 'Все растения'
})

const flatCategories = computed<FlatCategoryNode[]>(() => {
  const nodesById = new Map<string, CategoryTreeNode>()
  for (const category of categories.value) {
    nodesById.set(category.id, { ...category, children: [] })
  }

  const roots: CategoryTreeNode[] = []
  for (const node of nodesById.values()) {
    const parentId = node.parent?.id
    if (parentId && nodesById.has(parentId)) {
      nodesById.get(parentId)!.children.push(node)
      continue
    }
    roots.push(node)
  }

  const sortTree = (items: CategoryTreeNode[]) => {
    items.sort((a, b) => a.name.localeCompare(b.name))
    for (const item of items) {
      sortTree(item.children)
    }
  }
  sortTree(roots)

  const flattened: FlatCategoryNode[] = []
  const walk = (items: CategoryTreeNode[], depth = 0) => {
    for (const item of items) {
      flattened.push({
        id: item.id,
        name: item.name,
        depth,
        hasChildren: item.children.length > 0
      })
      walk(item.children, depth + 1)
    }
  }
  walk(roots)

  return flattened
})

const categoriesById = computed(() => {
  const map = new Map<string, Category>()
  for (const category of categories.value) {
    map.set(category.id, category)
  }
  return map
})

const categoryChildrenMap = computed(() => {
  const map = new Map<string, string[]>()
  for (const category of categories.value) {
    const parentId = category.parent?.id
    if (!parentId) {
      continue
    }

    const children = map.get(parentId) ?? []
    children.push(category.id)
    map.set(parentId, children)
  }
  return map
})

const categoryFilterSet = computed<Set<string> | null>(() => {
  if (!selectedCategoryId.value) {
    return null
  }
  if (!categoriesById.value.has(selectedCategoryId.value)) {
    return null
  }

  const includedIds = new Set<string>()
  const stack = [selectedCategoryId.value]
  while (stack.length > 0) {
    const currentId = stack.pop()!
    if (includedIds.has(currentId)) {
      continue
    }
    includedIds.add(currentId)

    const children = categoryChildrenMap.value.get(currentId) ?? []
    for (const childId of children) {
      stack.push(childId)
    }
  }

  return includedIds
})

const displayProducts = computed(() => {
  const hasAvailabilityFilter = inStockEnabled.value || outOfStockEnabled.value
  const range0 = selectedPriceRange.value?.[0] ?? priceRangeMin
  const range1 = selectedPriceRange.value?.[1] ?? priceRangeMax
  const hasPriceCap = range1 < priceRangeMax || range0 > priceRangeMin

  return realProducts.value.filter((product) => {
    if (product.isActive === false) {
      return false
    }

    if (categoryFilterSet.value) {
      const productCategoryId = product.category?.id
      if (!productCategoryId || !categoryFilterSet.value.has(productCategoryId)) {
        return false
      }
    }

    if (!hasAvailabilityFilter) {
      return false
    }

    const effectivePrice = product.salePrice ?? product.price
    const range0 = selectedPriceRange.value?.[0] ?? priceRangeMin
    const range1 = selectedPriceRange.value?.[1] ?? priceRangeMax

    if (effectivePrice < range0) {
      return false
    }
    // Only filter by max price if it's not the absolute maximum
    if (range1 < priceRangeMax && effectivePrice > range1) {
      return false
    }

    const quantityOnHand = product.inventoryItem?.quantityOnHand ?? 0
    const reserved = product.inventoryItem?.reserved ?? 0
    const isInStock = quantityOnHand - reserved > 0

    if (isInStock && !inStockEnabled.value) {
      return false
    }
    if (!isInStock && !outOfStockEnabled.value) {
      return false
    }

    return true
  })
})

const selectedSort = ref('featured')

const sortOptions = [
  { value: 'featured', label: 'Сортировка: По умолчанию' },
  { value: 'price-asc', label: 'Цена: По возрастанию' },
  { value: 'price-desc', label: 'Цена: По убыванию' },
  { value: 'newest', label: 'Новинки' },
]

const sortedProducts = computed(() => {
  const products = [...displayProducts.value]
  
  switch (selectedSort.value) {
    case 'price-asc':
      products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
      break
    case 'price-desc':
      products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
      break
    case 'newest':
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
    case 'featured':
    default:
      break
  }
  
  return products
})

const isUpdating = ref(false)
const delayedProducts = ref<Product[]>([])
let updateTimeout: ReturnType<typeof setTimeout> | null = null

watch(sortedProducts, (newProducts) => {
  // If it's the very first load and we haven't rendered yet, skip the animation delay
  if (delayedProducts.value.length === 0) {
    delayedProducts.value = newProducts
    return
  }
  
  isUpdating.value = true
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
  updateTimeout = setTimeout(() => {
    delayedProducts.value = newProducts
    isUpdating.value = false
  }, 250)
}, { immediate: true })

const addingItems = ref<Record<string, boolean>>({})

async function handleQuickAdd(event: Event, productId: string | number) {
  event.preventDefault()
  
  if (!authStore.isAuthenticated) {
    authMessage.value = 'Чтобы добавить товар, нужно авторизоваться'
    setTimeout(() => { authMessage.value = null }, 3000)
    return
  }

  addingItems.value[productId] = true
  try {
    await cartStore.addToCart(String(productId), 1)
  } finally {
    addingItems.value[productId] = false
  }
}
</script>
