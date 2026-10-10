<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DataAkademikExport implements Export, WithMultipleSheets
{
    /**
     * @var array<int, array{title: string, headers: array, rows: array}>
     */
    protected array $sheets;

    public function __construct(array $sheets)
    {
        $this->sheets = $sheets;
    }

    public function sheets(): array
    {
        return array_values(array_map(
            fn ($sheet) => new GenericArrayExport(
                $sheet['headers'],
                $sheet['rows'],
                $sheet['title']
            ),
            $this->sheets
        ));
    }
}
