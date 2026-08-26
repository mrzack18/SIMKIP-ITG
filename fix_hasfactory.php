<?php
$models = glob("app/Models/*.php");
foreach ($models as $file) {
    $content = file_get_contents($file);
    if (strpos($content, 'use HasFactory;') === false) {
        $content = preg_replace('/use Illuminate\\\\Database\\\\Eloquent\\\\Model;/', "use Illuminate\\Database\\Eloquent\\Model;\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;", $content);
        $content = preg_replace('/class\s+([A-Za-z0-9_]+)\s+extends\s+Model\s*\{/', "class $1 extends Model\n{\n    use HasFactory;\n", $content);
        file_put_contents($file, $content);
    }
}
