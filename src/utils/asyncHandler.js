const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error))
    }
}

export {asyncHandler}


// const asyncHandler=() => {}
// // const asyncHandler=(func) => { () => {} }
// // const asyncHandler=(func) => () => {}                    both three are same syntax of higher order function
// // const asyncHandler= (func) => async() => {}



// const asyncHandler=(fn) => async(res ,req , next) => {
//     try{
//         await fn(res,req,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }