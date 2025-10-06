using Microsoft.Extensions.Diagnostics.HealthChecks;
using OrdersFlow.Services;

public class InMemoryQueueHealthCheck : IHealthCheck
{
    private readonly InMemoryOrderQueue _queue;
    public InMemoryQueueHealthCheck(InMemoryOrderQueue queue) => _queue = queue;

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult(HealthCheckResult.Healthy("In-memory queue is running."));
    }
}
