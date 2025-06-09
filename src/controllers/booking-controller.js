const {StatusCodes} = require('http-status-codes');
const {BookingService} = require('../services');
const {SuccessResponse, ErrorResponse} = require('../utils/common');

const inMemDb = {};
async function createBooking(req, res){
    try{
        console.log(req.body);
        // const response = await BookingService.createBooking({
        //     flightId : req.body.flightId,
        //     userId : req.body.userId,
        //     noOfSeats : req.body.noOfSeats,
        // });
        const flightId = req.body.flightId || req.query.flightId;
        const userId = req.body.userId || req.query.userId;
        const noOfSeats = req.body.noOfSeats || req.query.noOfSeats;

        const response = await BookingService.createBooking({
            flightId,
            userId,
            noOfSeats,
        });

        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch(error){
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function makePayment(req, res){
    try{
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message : "Idempotency key is required"
            });
        }
        if(inMemDb[idempotencyKey]){
            return res.status(StatusCodes.OK).json({
                message : "Payment already processed"
            });
        }
        const response = await BookingService.makePayment({
            totalCost : req.body.totalCost,
            userId : req.body.userId,
            bookingId : req.body.bookingId,
        });
        inMemDb[idempotencyKey] = idempotencyKey;
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch(error){
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


module.exports = {
    createBooking,
    makePayment
};