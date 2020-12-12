import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  rooms: Array<Room>;
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['Int'];
  roomName: Scalars['String'];
  description: Scalars['String'];
  maxPeople: Scalars['Int'];
  private: Scalars['Boolean'];
  currentUsers: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
};


export type MutationCreateRoomArgs = {
  input: RoomInput;
};

export type RoomInput = {
  roomName: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  maxPeople?: Maybe<Scalars['Int']>;
  private?: Maybe<Scalars['Boolean']>;
  password?: Maybe<Scalars['String']>;
  creatorKey: Scalars['String'];
};

export type CreateRoomMutationVariables = Exact<{
  userInput: RoomInput;
}>;


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'roomName' | 'description' | 'maxPeople' | 'private'>
  ) }
);

export type RoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type RoomsQuery = (
  { __typename?: 'Query' }
  & { rooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'roomName' | 'description' | 'currentUsers' | 'maxPeople' | 'private'>
  )> }
);


export const CreateRoomDocument = gql`
    mutation CreateRoom($userInput: RoomInput!) {
  createRoom(input: $userInput) {
    roomName
    description
    maxPeople
    private
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, baseOptions);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const RoomsDocument = gql`
    query Rooms {
  rooms {
    id
    roomName
    description
    currentUsers
    maxPeople
    private
  }
}
    `;

/**
 * __useRoomsQuery__
 *
 * To run a query within a React component, call `useRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRoomsQuery(baseOptions?: Apollo.QueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
        return Apollo.useQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, baseOptions);
      }
export function useRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoomsQuery, RoomsQueryVariables>) {
          return Apollo.useLazyQuery<RoomsQuery, RoomsQueryVariables>(RoomsDocument, baseOptions);
        }
export type RoomsQueryHookResult = ReturnType<typeof useRoomsQuery>;
export type RoomsLazyQueryHookResult = ReturnType<typeof useRoomsLazyQuery>;
export type RoomsQueryResult = Apollo.QueryResult<RoomsQuery, RoomsQueryVariables>;