import React from 'react';
// import { action } from '@storybook/addon-actions';
import Relations from '../src'

export default {
  title: 'Relations',
  component: Relations,
};

export const Empty = () => (
  <Relations
    width={100}
    height={100}
    relations={[]}
  />
)

export const OneNode = () => (
  <Relations
    width={100}
    height={100}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#00FFFF',
      bgColor: '#000000',
      relations: []
    }]}
  />
)

export const One2One = () => (
  <Relations
    width={100}
    height={100}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#000000',
      bgColor: '#121212',
      relations: [{
        name: 'Peer',
        value: 1,
        color: '#ff0000',
        bgColor: '#000000',
      }]
    }]}
  />
)
