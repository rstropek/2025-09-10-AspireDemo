using System.Collections;
using System.Diagnostics;
using GrpcDemo;
using MQTTnet;
using WebApi;

AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

builder.Services.AddGrpcClient<Greeter.GreeterClient>(o =>
{
    o.Address = new Uri("http://grpcserver");
});

builder.Services.AddSingleton<MqttClientFactory>();

builder.AddMongoDBClient(connectionName: "mongodbdatabase");

builder.Services.AddCors();
var app = builder.Build();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
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

app.UseMqttMessaging();
app.UseUserManagement();
app.UseRustyEndpoints();

app.Run();
