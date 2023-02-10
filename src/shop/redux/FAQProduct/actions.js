import { createSideEffectAction } from '../../utils/reduxHelper';
import { faqService } from '../../services';
import { GET_FAQ_LIST, ADD_FAQ } from './types';

export const [
  getFAQListBegin,
  getFAQListSuccess,
  getFAQListFail,
  getFAQListEnd
] = createSideEffectAction(GET_FAQ_LIST);

export const [
  addFAQBegin,
  addFAQSuccess,
  addFAQFail,
  addFAQEnd
] = createSideEffectAction(ADD_FAQ);


export function getAllFAQ(productId, refreshing = false, page = 0) {
  return async (dispatch) => {
    try {
      dispatch(getFAQListBegin({ refreshing }));
      const result = await faqService.getAllFAQ(productId, page);
      dispatch(getFAQListSuccess({ ...result.data }));
    } catch (e) {
      dispatch(
        getFAQListFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(getFAQListEnd());
    }
  };
}

export function addFAQ(data, callback) {
  return async (dispatch) => {
    try {
      dispatch(addFAQBegin());
      const result = await faqService.addFAQ(data);
      dispatch(addFAQSuccess({ ...result.data }));
      if (callback) {
        callback();
      }
    } catch (e) {
      if (callback) {
        callback();
      }
      dispatch(
        addFAQFail({
          title: 'Đã có lỗi xảy ra',
          message: ''
        })
      );
    } finally {
      dispatch(addFAQEnd());
    }
  };
}
