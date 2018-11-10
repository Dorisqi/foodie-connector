class Menu {
  static generateMap(restaurantMenu) {
    const optionGroupMap = {};
    for (let i = 0; i < restaurantMenu.product_option_groups.length; i += 1) {
      const optionGroup = restaurantMenu.product_option_groups[i];
      const optionMap = {};
      optionGroup.product_options.forEach((option) => {
        optionMap[option.id] = option;
      });
      optionGroup.product_option_map = optionMap;
      optionGroup.is_radio = optionGroup.min_choice === 1 && optionGroup.max_choice === 1;
      optionGroupMap[optionGroup.id] = optionGroup;
    }
    const productMap = {};
    restaurantMenu.product_categories.forEach((category) => {
      for (let i = 0; i < category.products.length; i += 1) {
        const product = category.products[i];
        const groupMap = {};
        product.product_option_groups.forEach((optionGroupId) => {
          groupMap[optionGroupId] = optionGroupMap[optionGroupId];
        });
        product.product_option_group_map = groupMap;
        productMap[product.id] = product;
      }
    });
    return productMap;
  }
}

export default Menu;
