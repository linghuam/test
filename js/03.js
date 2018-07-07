const TREE_ROOT = {
    value: 1,
    children: [{
            value: 2,
            children: [{
                    value: 4,
                    children: null
                },
                {
                    value: 5,
                    children: null
                }
            ]
        },
        {
            value: 3,
            children: [{
                    value: 6,
                    children: null
                },
                {
                    value: 7,
                    children: null
                }
            ]
        }
    ]
}

function print (root) {
    console.log(root.value)
    if (root.children && root.children.length) {
        for (let i = 0, len = root.children.length; i < len; i++) {
            print(root.children[i])
        }
    }
}

print(TREE_ROOT)


const node7 = {
    value: 7,
    children:[]
}
const node6 = {
    value: 6,
    children: []
}
const node5 = {
    value: 5,
    children: []
}
const node4 = {
    value: 4,
    children: []
}
const node3 = {
    value: 3,
    children: [ node6, node7 ]
}
const node2 = {
    value: 2,
    children: [ node4, node5 ]
}
const node1 = {
    value: 1,
    children: [node2, node3]
}

let arr = []
arr.push(node1)
for (let i = 0; i < arr.length; i++) {
    let arri = arr[i]
    console.log(arri.value)
    if (arri.children && arri.children.length) {
        arr.push(...arri.children)
    }
}