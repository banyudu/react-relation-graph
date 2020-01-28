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
      bgColor: '#1890ff',
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
      bgColor: 'blue',
      relations: [{
        name: 'Peer',
        value: 1,
        color: '#ff0000',
        bgColor: '#1890ff',
      }]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
    debug
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
      bgColor: 'blue',
      relations: [
        { name: 'Peer1', value: 1, color: '#ff0000', bgColor: '#1890ff' },
        { name: 'Peer2', value: 1, color: '#ff0000', bgColor: '#1890ff' }
      ]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
    debug
  />
)

export const One2Three = () => (
  <Relations
    width={500}
    height={500}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#000000',
      bgColor: 'blue',
      relations: [
        { name: 'Peer1', value: 1, color: '#ff0000', bgColor: '#1890ff' },
        { name: 'Peer2', value: 1, color: '#ff0000', bgColor: '#1890ff' },
        { name: 'Peer3', value: 1, color: '#ff0000', bgColor: '#1890ff' }
      ]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
  />
)

export const One2Four = () => (
  <Relations
    width={500}
    height={500}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#000000',
      bgColor: 'blue',
      relations: [
        { name: 'Peer1', value: 1, color: '#ff0000', bgColor: 'yellow' },
        { name: 'Peer2', value: 3, color: '#00ff00', bgColor: 'orange' },
        { name: 'Peer3', value: 2, color: '#0000ff', bgColor: 'purple' },
        { name: 'Peer4', value: 4, color: '#222222', bgColor: 'darkgreen' }
      ]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
    debug
  />
)

export const One2Five = () => (
  <Relations
    width={800}
    height={800}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#000000',
      bgColor: 'blue',
      relations: [
        { name: 'Peer1', value: 10, color: '#ff0000', bgColor: 'yellow' },
        { name: 'Peer2', value: 8, color: '#00ff00', bgColor: 'orange' },
        { name: 'Peer3', value: 5, color: '#0000ff', bgColor: 'purple' },
        { name: 'Peer4', value: 3, color: '#222222', bgColor: 'darkgreen' },
        { name: 'Peer5', value: 1, color: '#222222', bgColor: 'pink' }
      ]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
    debug
  />
)

export const SubRelations = () => (
  <Relations
    width={600}
    height={600}
    relations={[{
      name: 'Root',
      value: 0,
      color: '#000000',
      bgColor: 'blue',
      relations: [
        {
          name: 'Peer1',
          value: 5,
          color: '#ff0000',
          bgColor: 'yellow',
          relations: [
            { name: 'Peer1-1', value: 3, color: '#222222', bgColor: 'darkgreen' },
            { name: 'Peer1-2', value: 1, color: '#222222', bgColor: 'pink' }
          ]
        }, {
          name: 'Peer2',
          value: 8,
          color: '#00ff00',
          bgColor: 'orange',
          relations: [
            { name: 'Peer2-1', value: 1, color: '#222222', bgColor: 'darkgreen' },
            { name: 'Peer2-2', value: 1, color: '#222222', bgColor: 'pink' },
            { name: 'Peer2-3', value: 1, color: '#222222', bgColor: 'blue' },
            { name: 'Peer2-4', value: 1, color: '#222222', bgColor: 'darkgrey' }
          ]
        },
        { name: 'Peer3', value: 5, color: '#0000ff', bgColor: 'purple' },
      ]
    }]}
    onClick={(relation) => console.log('clicked: ', relation.name)}
    bgColor={'grey'}
  />
)
