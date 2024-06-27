export type User = {
    id: number,
    fio: string,
    login: string
};

export type Message = {
    id: number,
    from: number,
    to: number,
    title: string,
    description: string,
    sendingDate: string,
    status: boolean
};
