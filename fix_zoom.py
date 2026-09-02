import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\admin\DokumenQueue.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """              ) : (
                <>
                  <GenericPreview doc={reviewing} data={previewGeneric} />
                  {/* Zoom controls for generic only */}
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                      className="p-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "#E2E8F0" }}>
                      <ZoomOut size={14} />
                    </button>
                    <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                      className="p-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: "#E2E8F0" }}>
                      <ZoomIn size={14} />
                    </button>
                    <button className="ml-2 flex items-center gap-1 text-xs hover:underline" style={{ color: "#263F93" }}>
                      <Download size={12} /> Download Asli
                    </button>
                  </div>
                </>
              )}"""

new_block = """              ) : (
                <GenericPreview doc={reviewing} data={previewGeneric} />
              )}"""

content = content.replace(old_block, new_block)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed dead zoom controls")
