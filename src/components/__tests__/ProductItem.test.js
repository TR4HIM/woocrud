import React from 'react';
import { shallow } from '../../../jest.setup'
import ProductItem from '../product-item/ProductItem';

const minData = {id:1 , isUpdated : true , name : 'product1' , regular_price : 10 , sale_price : 15, images : [{src:'urlImg3'},{src:'urlImg2'}] }

describe('Component : <ProductItem />', () => {
  it('Expect component to render', () => {
    const wrapper = shallow(<ProductItem data={minData} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Expect update class to be added', () => {
    const wrapper = shallow(<ProductItem data={minData} />);
    expect(wrapper.find('.product-item-updated').exists()).toEqual(true);
  });

  it('Expect product image to render', () => {
    const wrapper = shallow(<ProductItem data={minData} />);
    expect(wrapper.find('.thumbnail').exists()).toEqual(true);
    expect(wrapper.find('.no-thumbnail').exists()).toEqual(false);
  });

});