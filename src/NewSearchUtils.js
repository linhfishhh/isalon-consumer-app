import Utils from './configs';
const defaultFilters = Utils.getDefaultFilters();
export const buildSearchQuery = (keyword, search_state, extra) =>{
    let filters = search_state.filters;
    let location = false;
    let location_lv = false;
    if(search_state.search_location.id || filters.local.id){
      if(filters.local.id){
        location = [
          filters.local.id
        ];
        location_lv = 2
      }
      else{
        location = [
          search_state.search_location.id
        ];
        location_lv = 1
      }
    }

    return {
      keyword: keyword,
      search_type: search_state.search_type.slug,
      // lv1: 0,
      // lv2: [
      //   filters.local.id
      // ],
      location: location,
      location_lv: location_lv,
      cat: filters.cat,
      rating: filters.rating,
      is_sale: filters.sale_off,
      price_from: filters.price_from === defaultFilters.price_from?0:filters.price_from,
      price_to: filters.price_to === defaultFilters.price_to?0:filters.price_to,
      ...extra
    };
};