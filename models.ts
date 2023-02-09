import {Record} from "pocketbase";

export type BaseModel = {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    expand: any;
} & Record

export type UserModel = {
    username: string;
    email: string;
    avatar: string;
    aboutMe?: string;
    emailNotifications: boolean;
    telephone?: string;
    terms: boolean;
    verified: boolean;
} & BaseModel

export type SellerView = Pick<UserModel, "id" | "username" | "aboutMe" | "avatar">

export type CategoryModel = {
    name: string;
    description: string;
    icon: string;
} & BaseModel

export type ProductModel = {
    name: string;

    height: number;
    width: number;
    depth: number;
    weight: number;

    shipping: boolean
    pickup: boolean;

    description: string;
    included: string;

    seller: string;
    categories: string[]

    sold: boolean;
    archived: boolean;

    price: number;

    images: string[];

    expand: {
        seller: SellerView
        categories: CategoryModel[]
    }
} & BaseModel
