import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'

import categoryApi from 'src/apis/categoriest'
import Pagination from 'src/components/Pagination'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig, Product as ProductType } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'
import { Head } from 'src/components/head'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  // console.log('queryParam', queryParam)
  // Product list use query to get data from server
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  // Product list use query to get data from server
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  console.log(productsData?.data.data)
  return (
    <div className='bg-gray-200 py-6'>
      <Head title={'Product List'} />
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
          </div>

          {productsData && (
            <div className='sticky z-10 col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product: ProductType) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* note: if notication show Type 'number | undefined' is not assignable to type 'number'.
              Because productsQuery can be undefined, so we need to check it. should give move check "data" to the over of the code
              */}
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
