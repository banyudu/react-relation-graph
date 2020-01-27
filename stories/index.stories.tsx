import React from 'react';
// import { action } from '@storybook/addon-actions';
import Relations from '../src'

export default {
  title: 'Relations',
  component: Relations,
};

export const Empty = () => (
  <Relations
    width={800}
    height={800}
    relations={[]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
  />
)

export const OneNode = () => (
  <Relations
    width={800}
    height={800}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#00FFFF',
      bgColor: '#000000',
      relations: []
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
  />
)

export const One2One = () => (
  <Relations
    width={500}
    height={500}
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
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
  />
)

export const One2Two = () => (
  <Relations
    width={500}
    height={500}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#000000',
      bgColor: '#121212',
      relations: [
        { name: 'Peer1', value: 1, color: '#ff0000', bgColor: '#000000' },
        { name: 'Peer2', value: 1, color: '#ff0000', bgColor: '#000000' }
      ]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
  />
)
