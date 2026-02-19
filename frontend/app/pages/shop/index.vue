<template>
  <div class="container mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Sidebar Filters -->
      <aside class="w-full md:w-64 space-y-8 flex-shrink-0 hidden md:block">
        <div>
          <h3 class="font-serif text-lg mb-4">Categories</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>
              <button
                class="hover:text-primary transition-colors"
                :class="!selectedCategoryId ? 'font-medium text-primary' : 'text-gray-700'"
                @click="selectedCategoryId = null"
              >
                All Plants ({{ totalProducts }})
              </button>
            </li>
            <template v-if="categoriesPending">
              <li class="text-xs text-gray-400">Loading categories...</li>
            </template>
            <template v-else-if="flatCategories.length === 0">
              <li class="text-xs text-gray-400">No categories yet</li>
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
                    Group
                  </span>
                </button>
              </li>
            </template>
          </ul>
        </div>
        
        <div>
           <h3 class="font-serif text-lg mb-4">Price</h3>
           <div class="space-y-4">
             <div class="flex items-center gap-2 text-sm text-gray-500">
                <span>$0</span>
                <input type="range" min="0" max="200" class="flex-grow h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary">
                <span>$200+</span>
             </div>
           </div>
        </div>

        <div>
           <h3 class="font-serif text-lg mb-4">Availability</h3>
           <div class="space-y-2">
             <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
               <input
                 v-model="inStockEnabled"
                 type="checkbox"
                 class="rounded border-gray-300 text-primary focus:ring-primary"
               >
               In Stock
             </label>
             <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
               <input
                 v-model="outOfStockEnabled"
                 type="checkbox"
                 class="rounded border-gray-300 text-primary focus:ring-primary"
               >
               Out of Stock
             </label>
           </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <div class="flex-grow">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-serif">{{ selectedCategoryName }}</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 hidden sm:block">Showing {{ displayProducts.length }} products</span>
            <select class="border-gray-200 rounded-md text-sm focus:ring-primary focus:border-primary cursor-pointer py-2 pl-3 pr-8">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-100 aspect-[3/4] mb-4"></div>
            <div class="h-4 bg-gray-100 w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-100 w-1/4"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <div v-for="product in displayProducts" :key="product.id" class="group cursor-pointer">
            <NuxtLink :to="`/shop/${product.id}`">
              <div class="relative overflow-hidden aspect-[3/4] bg-[#f4f7f6] mb-4">
                <img 
                  :src="product.imageUrl ?? undefined" 
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <!-- Badges -->
                <div v-if="product.isNew" class="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] uppercase tracking-widest font-medium">
                  New
                </div>
                <div v-if="product.isSale" class="absolute top-3 left-3 bg-accent text-white px-2 py-1 text-[10px] uppercase tracking-widest font-medium">
                  Sale
                </div>

                <!-- Quick Add Button -->
                <button class="absolute bottom-4 right-4 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300">
                  <Icon name="lucide:shopping-bag" size="18" />
                </button>
              </div>
              
              <div class="space-y-1">
                <h3 class="font-serif text-lg leading-tight group-hover:text-primary transition-colors">{{ product.name }}</h3>
                <div class="flex items-center gap-2 text-sm">
                  <span :class="{'text-accent font-medium': product.salePrice, 'text-gray-500': !product.salePrice}">
                    ${{ product.salePrice || product.price }}
                  </span>
                  <span v-if="product.salePrice" class="text-gray-400 line-through text-xs">${{ product.price }}</span>
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
const totalProducts = computed(() => realProducts.value.length)
const selectedCategoryName = computed(() => {
  if (!selectedCategoryId.value) {
    return 'All Plants'
  }
  const selected = categories.value.find((category) => category.id === selectedCategoryId.value)
  return selected?.name ?? 'All Plants'
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
</script>
