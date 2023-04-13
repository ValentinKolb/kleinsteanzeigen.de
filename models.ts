import {Record} from "pocketbase";

export type BaseModel = {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
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

export type SellerView = Pick<UserModel, "id" | "username" | "aboutMe" | "avatar"> & BaseModel

export type CategoryModel = {
    name: string;
    description: string;
    icon: string;
} & BaseModel

export type ProductModel = {
    name: string;

    location_name: string;
    location_lat: number;
    location_lon: number;

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

export type BookmarkModel = {
    product: string;
    user: string;
    expand: {
        product: ProductModel
        user: UserModel
    }
} & BaseModel
