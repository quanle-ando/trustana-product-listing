import { Checkbox } from "antd";
import { twJoin } from "tailwind-merge";
import { useProductsStore } from "../../model/products.store";

export default function SelectCheckbox({ skuId }: { skuId: string }) {
  const { selectedProductSkuIds } = useProductsStore().state;

  return (
    <div className={twJoin("w-full", "text-right")}>
      <Checkbox
        checked={selectedProductSkuIds.has(skuId)}
        onChange={() => {
          if (!selectedProductSkuIds.delete(skuId)) {
            selectedProductSkuIds.add(skuId);
          }

          useProductsStore
            .getState()
            .functions.updateStore({
              selectedProductSkuIds: new Set(selectedProductSkuIds),
            });
        }}
      />
    </div>
  );
}
