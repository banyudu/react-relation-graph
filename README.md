# react-relation-graph
React Relation Graph

## Demo

```typescript
import ReactRelationGraph from 'react-relation-graph'

export const SubRelations = () => (
  <ReactRelationGraph
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
    bgColor='#E5E7E9'
  />
```

![](https://user-images.githubusercontent.com/2416493/73237868-d866d200-418e-11ea-8e96-72eba868c0b9.png)
![](https://user-images.githubusercontent.com/2416493/73262874-2697c780-41c7-11ea-9e0a-d660b6686e6b.png)
