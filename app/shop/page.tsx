// app/shop/page.tsx
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ShopClient from '@/components/shop/ShopClient'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  try {
    await dbConnect()

    const params = await searchParams
    const category = params?.category || 'all'
    const page = parseInt(params?.page || '1')
    const limit = 12
    const sort = params?.sort || 'newest'
    const minPrice = params?.minPrice ? parseInt(params.minPrice) : undefined
    const maxPrice = params?.maxPrice ? parseInt(params.maxPrice) : undefined
    const search = params?.search || ''

    // Build filter
    const filter: any = { isActive: true }
    if (category && category !== 'all') {
      // convert category name or slug to ObjectId
      const catDoc = await Category.findOne({
        $or: [{ name: category }, { slug: category }]
      }).lean()
      if (catDoc) {
        filter.category = catDoc._id
      }
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {}
      if (minPrice !== undefined) filter.price.$gte = minPrice
      if (maxPrice !== undefined) filter.price.$lte = maxPrice
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ]
    }

    // Build sort
    let sortOption: any = {}
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 }
        break
      case 'price-high':
        sortOption = { price: -1 }
        break
      case 'popular':
        sortOption = { sold: -1 }
        break
      case 'newest':
      default:
        sortOption = { createdAt: -1 }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get products
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .lean()

    // Get total count
    const total = await Product.countDocuments(filter)

    // Get category names for filter (active categories)
    const categoriesData = await Category.find({ status: 'active' }).lean()
    const categories = categoriesData.map(c => c.name)

    // Create category map for product display
    const categoryMap = categoriesData.reduce((acc, cat) => {
      acc[cat._id.toString()] = cat.name
      return acc
    }, {} as Record<string, string>)

    const productsData = products.map(p => ({
      _id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      price: p.price,
      category: categoryMap[p.category.toString()] || p.category.toString(),
      badge: p.badge,
      image: Array.isArray(p.images) && p.images.length ? p.images[0] : p.image || '',
      sizes: p.sizes,
      colors: p.colors,
      stock: p.stock,
      description: p.description,
      rating: p.rating || 4.5,
      reviews: p.reviews || 0
    }))

    return (
      <>
        <Navbar />
        <ShopClient 
          products={productsData} 
          total={total}
          currentPage={page}
          pageSize={limit}
          categories={categories}
          currentCategory={category}
          currentSort={sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
          search={search}
        />
        <Footer variant="green" />
      </>
    )
  } catch (error) {
    console.error('Shop page error:', error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Failed to load products
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please try again later
            </p>
          </div>
        </div>
        <Footer variant="green" />
      </>
    )
  }
}