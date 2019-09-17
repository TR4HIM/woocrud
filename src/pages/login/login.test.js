import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';


import { Login } from './Login';

configure({adapter: new Adapter()});

it("Login loads with initial state of null", () => {
    const wrapper = shallow(<Login />);
    const text = wrapper.find("p").text();
    expect(text).toEqual("admin");
  });
