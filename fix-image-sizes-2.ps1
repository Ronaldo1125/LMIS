$file = Get-Content "web\app\Components\RecentAdditions\RecentAdditions.jsx"
$file = $file -replace 'sizes="\(max-width: 640px\) 50vw, \(max-width: 768px\) 20vw, \(max-width: 1024px\) 20vw, 16vw"`n            style={{ objectFit: "cover" }}', 'sizes="(max-width: 640px) 50vw, (max-width: 768px) 20vw, (max-width: 1024px) 20vw, 16vw"`' + "`n" + '            style={{ objectFit: "cover" }}'
$file | Set-Content "web\app\Components\RecentAdditions\RecentAdditions.jsx"

# Also fix FrequentlySearched
$file2 = Get-Content "web\app\Components\FrequentlySearched\FrequentlySearched.jsx"
$file2 = $file2 -replace 'sizes="\(max-width: 640px\) 50vw, \(max-width: 768px\) 20vw, \(max-width: 1024px\) 20vw, 16vw"`n            style={{ objectFit: "cover" }}', 'sizes="(max-width: 640px) 50vw, (max-width: 768px) 20vw, (max-width: 1024px) 20vw, 16vw"`' + "`n" + '            style={{ objectFit: "cover" }}'
$file2 | Set-Content "web\app\Components\FrequentlySearched\FrequentlySearched.jsx"
