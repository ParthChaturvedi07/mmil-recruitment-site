
const submissionClosedMiddleware = (req, res, next) => {
    return res.status(403).json({ message: "Project submissions are now closed." });
};

export default submissionClosedMiddleware;
