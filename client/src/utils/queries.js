// import
import { gql } from "@apollo/client"

// queries
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      bookCount
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`
