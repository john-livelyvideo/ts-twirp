"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/camelcase */
const client_1 = require("./client");
test('converting JSON responses to message properties', () => {
    const response = Buffer.from(JSON.stringify({
        a_long_key: 'value1',
        nested_thing: {
            some_number: 5,
            deeper_nesting: {
                value: null,
            },
        },
        array_key: [{ key: 'value' }, { bool: false }, { not_there: null }],
    }));
    const properties = client_1.jsonToMessageProperties(response);
    expect(properties).toEqual({
        aLongKey: 'value1',
        nestedThing: {
            someNumber: 5,
            deeperNesting: {
                value: null,
            },
        },
        arrayKey: [
            {
                key: 'value',
            },
            {
                bool: false,
            },
            {
                notThere: null,
            },
        ],
    });
});
