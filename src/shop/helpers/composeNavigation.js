import React from 'react';
import MainContainer from '../components/MainContainer';

const composeNavigation = (navigation) => (component) => (props) => {
  const newComponent = React.createElement(component, { ...props });
  const nav = React.createElement(navigation, { ...props });
  return (
    <MainContainer>
      {nav}
      {newComponent}
    </MainContainer>
  );
};

export default composeNavigation;
