import React from 'react';
import FastImage from 'react-native-fast-image';
// import { TENANT_ID } from '../constants';

type Props = {
  style: Object,
  source: Object,
  resizeMode?: String,
};

export default function Img({ style, source, resizeMode }: Props) {
  return (
    // <Image style={style} source={source} resizeMethod='scale' resizeMode={resizeMode}/>
    <FastImage style={style} source={source} resizeMethod="scale" resizeMode={resizeMode} />
  );
}

Img.defaultProps = {
  resizeMode: 'contain',
};

export function WebImage({ style, source, resizeMode }: Props) {
  const params = React.useMemo(() => ({
    uri: source,
  }), [source]);
  return (
    // <Image style={style} source={params} resizeMethod='scale' resizeMode={resizeMode}/>
    <FastImage style={style} source={params} resizeMethod="scale" resizeMode={resizeMode} />
  );
}

WebImage.defaultProps = {
  resizeMode: 'contain',
};
