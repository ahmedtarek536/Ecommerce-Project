using Ecommerce_Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Logging;
using System.Text;
using Ecommerce_Server.Services.SearchServices;
using Ecommerce_Server.Services;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Enable logging of PII (for development/debugging only)
if (builder.Environment.IsDevelopment())
{
    IdentityModelEventSource.ShowPII = true;
}

// Add services to the container

// Configure database context
builder.Services.AddDbContext<EcommerceDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Configure CORS policies
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();

    });

    options.AddPolicy("AllowLocalhostPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});




// Add services to the container.
builder.Services.AddControllers();



var jwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>();
builder.Services.AddSingleton(jwtOptions);


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SuperUsersOnly", builder =>
    {
        builder.RequireRole("User");
        builder.RequireClaim("UserType", "Employee");
        builder.RequireAssertion(context =>
        {
            // custom logic;
            return true;
        });
    });
});
    
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;  // Store the token in the HttpContext if needed

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Issuer, // Ensure this is set correctly
                ValidateAudience = true,
                ValidAudience = jwtOptions.Audience, // Ensure this is set correctly

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)) // Ensure the signing key is correct
            };
        });




// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();



// load products from data base into trie
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<EcommerceDbContext>();
    
    // Load data from database into Trie
    var products = dbContext.Products.AsNoTracking().ToList();
    TrieService _trie = TrieService.GetInstance();
    foreach (var product in products)
    {
        _trie.Insert(product.Name);  
    }
}



// Configure the HTTP request pipeline
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

// Use appropriate CORS policy
app.UseCors("AllowLocalhostPolicy"); // "AllowLocalhostPolicy" for specific origins in production

app.UseHttpsRedirection(); 
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();

// Run the application
app.Run();
