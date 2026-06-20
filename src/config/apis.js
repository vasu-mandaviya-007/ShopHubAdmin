
const localpath = 'http://localhost:3001'

const api_paths = {

     ImageUpload : `${localpath}/api/upload`,
     add_product : `${localpath}/products/addproduct`,
     remove_product : `${localpath}/products/remove_product`,
     all_products : `${localpath}/products/allproducts`,
     all_orders : `${localpath}/orders/allorders`

}

export default api_paths;