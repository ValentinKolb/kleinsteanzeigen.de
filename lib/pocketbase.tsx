import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react"
import PocketBase from 'pocketbase'
import {Alert, AlertProps} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import ms from "ms";
import {useInterval} from "@mantine/hooks";
import jwtDecode from "jwt-decode";
import {UserModel} from "../models";

const BASE_URL = "https://backend.kleinsteanzeigen.de"
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export type PocketbaseError = { response: { data: { [key: string]: { message: string } } } }

export const PocketbaseError = ({error, ...props}: { error: PocketbaseError } & Omit<AlertProps, "children">) => (<>
        {Object.keys(error.response.data).map((key, index) => (
            <Alert icon={<IconAlertCircle size="1rem"/>} title="Fehler" color="red" variant="light" mb={"sm"} {...props}
                   key={index}>
                {key}: {error.response.data[key].message}
            </Alert>
        ))}
    </>
)

const PocketContext = createContext({})

const PocketData = () => {
    const pb = useMemo(() => new PocketBase(BASE_URL), []);

    const [token, setToken] = useState(pb.authStore.token);
    const [user, setUser] = useState(pb.authStore.model);

    useEffect(() => {
        return pb.authStore.onChange((token, model) => {
            setToken(token)
            setUser(model)
        });
    }, [])

    const refresh = useCallback(async () => {
        await pb.collection("users").authRefresh()
    }, [pb])

    const register = useCallback(async (data: {}) => {
        return await pb
            .collection("users")
            .create(data);
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        return await pb.collection("users").authWithPassword(email, password);
    }, [])


    const logout = useCallback(() => {
        pb.authStore.clear();
    }, [])

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return;
        const decoded: any = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
        if (tokenExpiration < expirationWithBuffer) {
            await pb.collection("users").authRefresh();
        }
    }, [token]);

    useInterval(refreshSession, token ? twoMinutesInMs : Infinity)

    return {
        register,
        login,
        logout,
        user: user as UserModel | null,
        token,
        pb,
        refresh
    }
}

export const PocketProvider = ({children}: { children: ReactNode }) => {

    const data = PocketData()

    return (
        <PocketContext.Provider
            value={data}
        >
            {children}
        </PocketContext.Provider>
    );
};

export const usePB = () => {
    const pb = useContext(PocketContext)
    if (!pb) {
        throw new Error("usePB must be used inside PocketProvider")
    }
    return pb as ReturnType<typeof PocketData>
}
