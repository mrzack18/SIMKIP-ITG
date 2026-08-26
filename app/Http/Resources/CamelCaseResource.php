<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CamelCaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->camelCaseKeys(parent::toArray($request));
    }

    protected function camelCaseKeys($array)
    {
        if (!is_array($array)) {
            return $array;
        }

        $result = [];
        foreach ($array as $key => $value) {
            $camelKey = is_string($key) ? Str::camel($key) : $key;
            if (is_array($value)) {
                $result[$camelKey] = $this->camelCaseKeys($value);
            } else {
                $result[$camelKey] = $value;
            }
        }
        return $result;
    }
}
