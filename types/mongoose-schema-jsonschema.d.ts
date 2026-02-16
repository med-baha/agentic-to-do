declare module 'mongoose-schema-jsonschema' {
    import mongoose from 'mongoose';
    function factory(mongooseInstance?: typeof mongoose): typeof mongoose;
    export default factory;
}

declare module 'mongoose' {
    interface Schema {
        jsonSchema(): any;
    }
}
