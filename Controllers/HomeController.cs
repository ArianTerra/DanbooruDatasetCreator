using System.Diagnostics;
using DanbooruDatasetCreator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp;

namespace DanbooruDatasetCreator.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> ImageCrop(string filename, IFormFile blob, string tags)
    {
        try
        {
            using (var image = Image.Load(blob.OpenReadStream()))
            {
                if (image.Width != image.Height)
                {
                    return Json(new { Message = "Error: image should be a square" });
                }

                //image.Mutate(x => x.Resize(512, 512));

                var filepath = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images")).Root + $@"{filename}";
                await image.SaveAsync(filepath);

                await System.IO.File.WriteAllTextAsync(Path.ChangeExtension(filepath, ".txt"), tags);
            }

            return Json(new { Message = "OK" });
        }
        catch (Exception)
        {
            return Json(new { Message = "Error while processing file" });
        }
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}