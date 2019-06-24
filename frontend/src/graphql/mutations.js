import { gql } from 'apollo-boost'

export const CREATE_ITEM = gql`
  mutation createItem(
    $id: String!
    $description: String!
    $placeid: String!
    $name: String!
    $type: String!
    $photo: String
    $price: Int
    $lat: Float!
    $lng: Float!
  ) {
    createItem(
      id: $id
      data: {
        place: {
          description: $description
          placeid: $placeid
          name: $name
          type: $type
          photo: $photo
          price: $price
          location: [$lat, $lng]
        }
      }
    ) {
      id
      place {
        name
      }
    }
  }
`

export const UPDATE_DND_ITEM = gql`
  mutation updateDnDItem(
    $draggableId: String!
    $destination_droppableId: String!
    $destination_index: Int!
    $source_droppableId: String!
    $source_index: Int!
  ) {
    updateDnDItem(
      data: {

          draggableId: $draggableId
          destination_droppableId: $destination_droppableId
          destination_index: $destination_index
          source_droppableId: $source_droppableId
          source_index: $source_index
      }
    ) {
      id 
      itemsid
    }
  }
`

export const DELETE_ITEM = gql`
  mutation deleteItem(
    $itemId: String!
    $columnId: String!
  ) {
    deleteItem(
      data: {
          itemId: $itemId
          columnId: $columnId
      }
    ) {
      days {
        id 
        itemsid
      }
    }
  }
`