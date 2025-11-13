const catchAsync = myFn => {
	return (request, response, next) => {
		// myFn(request, Response, next).catch(err => next(err));
		myFn(request, response, next).catch(next);
	};
};

export { catchAsync };