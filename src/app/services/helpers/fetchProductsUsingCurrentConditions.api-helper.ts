import { ProductQuery } from "@/app/types/query-engine/product";
import { formatObject } from "@/app/utils/formatObject";
import { fetchProducts } from "../fetchProducts.api";
import { useProductsStore } from "@/app/containers/ProductTable/model/products.store";
import { mapProduct } from "@/app/utils/data-mapping/mapProduct.util";
import { generateProductFilters } from "@/app/utils/query-parser/generateProductFilters.util";

export const PRODUCT_SIZE_LIMIT = 100;

export async function fetchProductsUsingCurrentConditions() {
  const store = useProductsStore.getState();

  store.functions.updateStore({ isLoadingProducts: true });

  const { sort, page } = store.state;

  const filters = generateProductFilters();

  return fetchProducts({
    body: JSON.stringify(
      formatObject<ProductQuery>({
        filter: filters,
        ...(sort && {
          sort: {
            field: sort.field,
            order: sort.dir === "ascend" ? "ASC" : "DESC",
          },
        }),
        pagination: {
          limit: PRODUCT_SIZE_LIMIT,
          offset: page * PRODUCT_SIZE_LIMIT,
        },
      })
    ),
  }).then((response) => {
    useProductsStore.getState().functions.updateStore({
      products: response.data.map((pdt, index) =>
        mapProduct({ index, pdt, offset: page })
      ),
    });

    return response;
  });
}
