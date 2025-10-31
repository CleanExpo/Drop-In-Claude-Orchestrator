#!/usr/bin/env python3
"""
Code Validator Skill

Validates code changes against the orchestrator's guardrails and standards.
"""

import json
import sys
from typing import List, Dict, Any
from pathlib import Path
import re


def is_in_scope(file_path: str, write_scope: List[str]) -> bool:
    """Check if a file is within the allowed write scope."""
    for pattern in write_scope:
        # Convert glob pattern to regex
        regex_pattern = pattern.replace("**", ".*").replace("*", "[^/]*")
        if re.match(regex_pattern, file_path):
            return True
    return False


def is_protected(file_path: str, protected_files: List[str]) -> bool:
    """Check if a file is protected."""
    for pattern in protected_files:
        regex_pattern = pattern.replace("**", ".*").replace("*", "[^/]*")
        if re.match(regex_pattern, file_path):
            return True
    return False


def validate_typescript(content: str) -> List[Dict[str, Any]]:
    """Basic TypeScript validation."""
    warnings = []

    # Check for 'any' type usage (discouraged)
    if ": any" in content or "<any>" in content:
        warnings.append({
            "message": "Usage of 'any' type detected - prefer specific types",
            "severity": "warning"
        })

    # Check for console.log (should be removed in production)
    if "console.log(" in content:
        warnings.append({
            "message": "console.log detected - remove before production",
            "severity": "warning"
        })

    return warnings


def validate_files(
    files: List[Dict[str, Any]],
    write_scope: List[str],
    protected_files: List[str]
) -> Dict[str, Any]:
    """Validate a list of file changes."""
    errors = []
    warnings = []

    for file_info in files:
        file_path = file_info["path"]
        content = file_info.get("content", "")
        operation = file_info.get("operation", "modify")

        # Check write scope
        if not is_in_scope(file_path, write_scope):
            errors.append({
                "file": file_path,
                "message": f"File is outside write scope: {write_scope}",
                "severity": "error"
            })

        # Check protected files
        if is_protected(file_path, protected_files):
            errors.append({
                "file": file_path,
                "message": "Attempting to modify protected file",
                "severity": "error"
            })

        # TypeScript-specific validation
        if file_path.endswith((".ts", ".tsx")):
            file_warnings = validate_typescript(content)
            for warning in file_warnings:
                warnings.append({
                    "file": file_path,
                    **warning
                })

        # Check for test file
        test_path = file_path.replace(".ts", ".test.ts").replace(".tsx", ".test.tsx")
        has_tests = any(f["path"] == test_path for f in files)
        if not has_tests and file_path.endswith((".ts", ".tsx")):
            warnings.append({
                "file": file_path,
                "message": f"Missing test file: {test_path}",
                "severity": "warning"
            })

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }


def execute(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for the code validator skill.

    Args:
        input_data: {
            "files": [...],
            "writeScope": [...],
            "protectedFiles": [...]
        }

    Returns:
        Validation result
    """
    files = input_data.get("files", [])
    write_scope = input_data.get("writeScope", ["src/**", "app/**", "docs/**"])
    protected_files = input_data.get("protectedFiles", [".env*", "infra/**"])

    result = validate_files(files, write_scope, protected_files)

    return {
        "status": "success",
        "result": result
    }


if __name__ == "__main__":
    # Read input from stdin
    input_text = sys.stdin.read()
    input_data = json.loads(input_text)

    # Execute validation
    result = execute(input_data)

    # Output result as JSON
    print(json.dumps(result, indent=2))
