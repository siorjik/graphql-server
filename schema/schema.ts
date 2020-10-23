const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

type objType = { [key: string]: string | number }

interface IMovie {
  id: string;
  name: string;
  genre: string;
  directorId: string;
};

const movies = [
	{ id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1', },
	{ id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2', },
	{ id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3', },
	{ id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4', },
	{ id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
	{ id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
	{ id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
	{ id: '8', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
];

const directors = [
	{ id: '1', name: 'Quentin Tarantino', age: 55 },
	{ id: '2', name: 'Michael Radford', age: 72 },
	{ id: '3', name: 'James McTeigue', age: 51 },
	{ id: '4', name: 'Guy Ritchie', age: 50 },
];

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    directorId: { type: GraphQLString },
    director: {
			type: DirectorType,
			resolve(parent: objType, args: any) {
				return directors.find(director => director.id === parent.directorId);
			}
		}
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
		movies: {
			type: new GraphQLList(MovieType),
			resolve(parent: objType, args: any) {
				return movies.filter(movie => movie.directorId === parent.id);
			},
		},
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent: objType, args: any) {
        return movies.find(movie => movie.id === args.id);
      },
    },

    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return movies;
      },
    },

    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent: objType, args: any) {
        console.log(args);
        return directors.find(director => director.id === args.id);
      },
    },

    directors: {
			type: new GraphQLList(DirectorType),
			resolve(parent: objType, args: any) {
				return directors;
			}
		}
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
      },
      resolve(parent: objType, args: IMovie) {
        movies.push({ ...args });
        return { ...args }
      }
    },

    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent: objType, args: IMovie) {
        const index = movies.findIndex(el => el.id === args.id);
        const item = movies.find(el => el.id === args.id);

        index !== -1 && movies.splice(index, 1);
        return item;
      }
    }
  }
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
