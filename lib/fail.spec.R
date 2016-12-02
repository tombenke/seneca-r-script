# This script gets an object, which has a `pleaseFail` boolean property.
# If this value is `true`, then returns with a boolean `false` value, otherwise returns with `true`.
result <- TRUE
if (input[[1]]$pleaseFail) {
    result <- FALSE
}

list(result)
