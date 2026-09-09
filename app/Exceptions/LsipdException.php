<?php

namespace App\Exceptions;

use RuntimeException;
use Throwable;

class LsipdException extends RuntimeException
{
    public function __construct(
        string $message = 'LSIPD request failed',
        public readonly ?int $httpStatus = null,
        public readonly array $context = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }
}
