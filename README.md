# An Average Service

## Brief

The service will poll an external API for a random value every second and expose
a restful endpoint that returns the average of all the random values returned
from the external API.

Read the full [brief](./BRIEF.md)

## Assumptions

### Scalability

As the brief is to store the values in the memory of the service, the service can
not be scaled.

If it needed to be scaled, an in-memory data stores such as REDIS
or Memcached could be used. However this wouldn't solve the concurrency issues
that would be introduced to both polling the external API and memory writes.

### External API and Fault Tolerance

If an unrecoverable error response is returned from the external API
the average service should terminate.

## Design

The service will track 2 values

- current average value
- count of returned values

The average will be calculated as

```
new average = current average + ((next value - current average) / (current count of returned values + 1))

where the total no. return values includes the returned value being processed.
```

This algorithm is the most optimal way to track the average because it

- doesn't waste memory tracking all of the returned values
- avoids reaching `Infinity` by keeping a running total

I've chosen hapi for the framework and will implement the requirements as a Hapi plugin
to improve testability.
