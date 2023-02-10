import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  View
} from 'react-native';
import EvaluationHeader from './EvaluationHeader';
import EvaluationMessage from './EvaluationMessage';
import ImagePreviewer from '../../components/ImagePreviewer';
import {
  getImageUrl,
  getThumbImageUrl
} from '../../utils';


export default function EvaluationContent(props) {
  const {
    navigation,
    product,
    reviews,
    likeReivew,
    unlikeReview,
    likeReply,
    unlikeReply,
    onLoadmore
  } = props;

  const previewerRef = useRef(null);
  const [images, setImages] = useState([]);


  const onPreviewImage = (imagesSource) => {
    const imageList = imagesSource.map((img) => ({
      id: img.imageId,
      url: getImageUrl(img.imageId),
      thumbUrl: getThumbImageUrl(img.imageId),
      freeHeight: false
    }));
    setImages(imageList);
    previewerRef.current.show();
  };

  const keyExtractor = (item, index) => item + index;

  const renderItem = ({ item, index }) => (
    <EvaluationMessage
      message={item}
      likeReivew={likeReivew}
      unlikeReview={unlikeReview}
      likeReply={likeReply}
      unlikeReply={unlikeReply}
      isLast={reviews.length === index + 1}
      onPreviewImage={onPreviewImage}
    />
  );

  const header = () => (<EvaluationHeader navigation={navigation} product={product} />);

  const renderFooter = () => (<View style={internalStyles.header_footer} />);

  return (
    <>
      <FlatList
        style={internalStyles.content}
        data={reviews}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        maxToRenderPerBatch={4}
        initialNumToRender={1}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadmore}
        onEndReachedThreshold={0.1}
      />
      <ImagePreviewer ref={previewerRef} images={images} />
    </>
  );
}
EvaluationContent.defaultProps = {
  product: {}
};

const internalStyles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    flex: 1,
  },
  header_footer: {
    height: 20,
  }
});
