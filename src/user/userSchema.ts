import z from "zod";

const UserSchema = {
    me: z.object({
        id: z.string()
    })
}

export default UserSchema;