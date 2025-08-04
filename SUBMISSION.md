# Submission Notes

## Query Syntax

This app uses a **Lucene-style syntax** with the following extensions:

### Supported Filters

| Syntax                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `brand:"A Brand"`       | Filter by exact match and case sensitive |
| `name:*Apple*`          | Wildcard match (case-insensitive)        |
| `createdAt>=2023-01-01` | Numeric or date comparisons              |
| `NOT color:Red`         | Negation                                 |

### Date Syntax

- `dt(YYYY-MM-DD)` → e.g. `dt(2020-10-10)`
- `dt(friendly string)` → e.g. `dt(2 weeks ago)`

### Regex Syntax

- `regexp(expression)` → e.g. `regexp(apple|banana)`

### "In" Grouping

- `(Apple OR Banana OR "A Fruit")` – values grouped with parentheses and split by `OR`

### ⚙️ Behavior

- All conditions are joined with **implicit AND**
- Spaces split conditions unless inside parentheses or quotes
- Product filtering is supported with both input and query-builder methods, while attribute querying is currently input-only (query builder support can also be integrated for attribute querying)

---

## Sample URLs

[brand:regexp(apple)](http://localhost:3000/?query=brand%3Aregexp%28apple%29&attributes=name%2Cbrand%2C_basicInfoDateFirstAvailable&page=0)
[pdt.skuId:(TR08192520 OR TR08186510)](http://localhost:3000/?query=pdt.skuId%3A%28TR08192520+OR+TR08186510%29)

---

## Product Table

### Columns

- **Fixed Columns** (always shown):

  - Row Index
  - SKU ID
  - Product's Created At Date
  - Product's Updated At Date

- **Default Attributes** (shown by default, can be hidden):

  - Product Name
  - Brand

- **Dynamic Attributes**: Can be added from the `Attribute Column` which is loaded lazily on scroll

### 🔽 Sorting Options

| Label              | Field       | Order |
| ------------------ | ----------- | ----- |
| Name A-Z           | `name`      | ASC   |
| Name Z-A           | `name`      | DESC  |
| Last-Created First | `createdAt` | DESC  |
| Last-Created Last  | `createdAt` | ASC   |
| Last-Updated First | `updatedAt` | DESC  |
| Last-Updated Last  | `updatedAt` | ASC   |

---

## 🛠️ Architecture & Behavior

- **Product Table** is **virtualized** and **paginated**.
- **Attribute Column** is also **virtualized** but is **lazily loaded**.
- **Product fetching** is done **server-side** and tied to the URL's query parameters.
- **Attribute fetching** is done **client-side** and loaded lazily on scrolling to the bottom of the column. Request header `x-tracking-id` set by the server will be used to set the the same header in client-side API calls.
- **Selected Attributes** are grouped under a "Selected" section.
- **URL Sharing**: Query state is fully encoded in the URL for easy sharing.
  - (Future: Persist view to DB and return a unique URL key)
- **Product Selection**: Checkbox selection enabled; selected items count shown as a link (`<count> selected`) which can be shared.

---

## Libraries Added

- `antd`, `@ant-design/icons`: Provides a complete UI framework with prebuilt React components and a matching icon set. Used for tables, modals, filters, and layout.
- [`@ant-design/static-style-extract`](https://ant.design/docs/react/server-side-rendering#whole-export): Extracts Ant Design styles into static CSS files to support full SSR (server-side rendering) without runtime style injection issues.
- [`@ant-design/v5-patch-for-react-19`](https://ant.design/docs/react/v5-for-19): Ensures Ant Design v5 is compatible with React 19 features, especially around modal lifecycles and rendering changes.
- `dayjs`: Lightweight and performant date library for formatting and manipulating dates, including parsing Lucene-style filters like `dt(2 weeks ago)`.
- `dompurity`: A fast HTML sanitizer used to prevent XSS when rendering rich text data.
- `jsdom`: Simulate browser environment in Vitest.
- `nanoid`: A secure, URL-safe unique ID generator used for stable keys in list rendering or tracking selected items.
- `reselect`: Memoization library that derives computed data from the store efficiently, preventing unnecessary renders in large virtualized tables.
- `zustand`: Lightweight state management library for building stores that work seamlessly in both client and server environments (e.g. selected products, filters).
- `@tailwindcss/vite`: Integrates Tailwind CSS into the Vite build and test pipeline. Useful for utility-first styling in test environments or components that don’t rely on Ant Design.
- `@testing-library/*`: Testing library.
- `@vitestjs/*`: Plugins for vitest.
- `lodash`: General-purpose utility functions for object manipulation, deep cloning, array operations, etc. -`msw`: Mock service worker in tests
- `vite-tsconfig-paths`: Read alias paths from tsconfig.json into Vitest config.
- `vitest-preview`: Preview test
- `tsx`: Run Typescript scripts, e.g. the `prebuild` and `postbuild` scripts.

## Docker Scripts

- Run `yarn docker:build` or `npm run docker:build`
- Run `yarn docker:run` or `npm run docker:run`

## Fixes

- `src/app/mockData/products.json:132366` - Change special chars from `\\\\ud83e` to `\\ud83e` to fix build.
- `src/app/types/attribute.ts` - Add `dateFormat` and `timezone` for `AttributeOption` type.
- `src/app/types/*.ts` - Convert interface to type as a convention.
- `src/app/utils/query-engine/products.ts`
  - Fix `$ne` operation so
    - Nil values will be matched too.
    - `NOT exists` is supported.
    - `NOT $in` is supported for array values.
  - Fix `$in` to support array values.

## Assumptions

- `Product SKU ID`, `Created At`, and `Updated At` are required columns in the Product Table.
- `Product Name` and `Brand` are `required` columns for all products, and hence will be displayed by default.
- Besides sharing the query, user also wants to share specific products with their teams, and hence the feature to select the products and open them in a new tab.
