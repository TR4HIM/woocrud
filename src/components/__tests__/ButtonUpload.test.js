import React from 'react';
import { shallow } from '../../../jest.setup'
import ButtonUpload from '../button-upload/ButtonUpload';


describe('Component : <ButtonUpload />', () => {
  it('Renders Button Upload without multiple attribute', () => {
    const typeImage = 'thumbnail';
    const wrapper = shallow(<ButtonUpload typeImage={typeImage} />);

    // Expect the wrapper object to be defined
    expect(wrapper.find('.upload-image-holder').exists()).toEqual(true);
    expect(wrapper.find('input')).toBeDefined();
    expect(wrapper.find('input').prop('multiple')).toEqual(false);
  });

  it('Renders a button upload to support multiple files', () => {
    const typeImage = 'gallery';
    const wrapper = shallow(<ButtonUpload typeImage={typeImage} />);
    expect(wrapper.find('input').prop('multiple')).toEqual(true);
  });

  it('Should call prop function onChange', () => {
    const mockOnChange = jest.fn();
    const wrapper = shallow(<ButtonUpload onChange={mockOnChange} />);
    const event = {
        preventDefault() {},
        target: {
          files: [
            'dummyValue.something'
          ]   
      }
    };
    wrapper.find('input').simulate('change',event);
    expect(mockOnChange).toBeCalledWith(event);
  })
});