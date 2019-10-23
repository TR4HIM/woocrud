import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';


import UserProfile from './index';

configure({adapter: new Adapter()});

it('should render correctly with no props', () => {
    const component = shallow(<UserProfile/>);
    expect(component).toMatchSnapshot();
});
