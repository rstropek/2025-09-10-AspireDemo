using System.Diagnostics;
using GrpcDemo;

AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

foreach (System.Collections.DictionaryEntry envVar in Environment.GetEnvironmentVariables())
{
    Console.WriteLine($"{envVar.Key}={envVar.Value}");
}

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

builder.Services.AddGrpcClient<Greeter.GreeterClient>(o =>
{
    o.Address = new Uri("http://grpcserver");
});

var app = builder.Build();

app.MapDefaultEndpoints();
app.UseHttpsRedirection();

var source = new ActivitySource("WebApi");

app.MapGet("/ping", () => new { Message = "pong" });

app.MapGet("/callGreeter", async (Greeter.GreeterClient client) =>
{
    HelloReply reply;
    using (var activity = source.StartActivity("Calling gRPC Greeter"))
    {
        reply = await client.SayHelloAsync(new HelloRequest { Name = "WebApi" });
    }

    return Results.Ok(new { reply.Message });
});

app.Run();
