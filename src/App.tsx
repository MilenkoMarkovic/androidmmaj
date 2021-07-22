/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { createConnection, getRepository } from 'typeorm/browser';

import { Author } from './entities/author';
import { Category } from './entities/category';
import { Post } from './entities/post';

interface AppProps {

}

interface AppState {
    progress: string;
    loadedPost: Post | null;
    savedPost: boolean
}


export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { savedPost: false, progress: 'Post is being saved', loadedPost: null };
        this.runDemo();
    }

    connect() {
        return createConnection({
            type: 'react-native',
            database: 'test',
            location: 'default',
            logging: ['error', 'query', 'schema'],
            synchronize: true,
            entities: [
                Author,
                Category,
                Post
            ]
        });
    }

    async runDemo() {
        await this.connect();

        const category1 = new Category();
        category1.name = "Appcenter";

        const category2 = new Category();
        category2.name = "Programming";

        const author = new Author();
        author.name = "Person";

        const post = new Post();
        post.title = "Example app MAJ";
        post.text = "Updated parameters";
        post.categories = [category1, category2];
        post.author = author;

        const postRepository = getRepository(Post);
        await postRepository.save(post);

        console.log("Post has been saved");
        this.setState({
            progress: "Post has been saved"
        });

        const loadedPost = await postRepository.findOne({ where: { id: post.id }, relations: ["author", "categories"] });



        if (loadedPost) {
            console.log("Post has been loaded: ", loadedPost);
            this.setState({
                loadedPost: loadedPost
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to the React Native Example for TypeORM!
        </Text>
                <Text style={styles.small}>
                    {this.state.progress}
                </Text>
                <Text style={styles.small}>
                    {JSON.stringify(this.state.loadedPost)}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    small: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});