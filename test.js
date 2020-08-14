
let storage = []
function fn(n) {
    if(n == 0) storage.push(0)
    if(n == 1) storage.push(1)
    if(n > 1) {
        storage.push(n)
        fn(n-1)
    }
}

fn(50)
let sum = 0
storage.map(item =>{
    sum += item
})
console.log(sum)